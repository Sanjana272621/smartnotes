import os
import pickle
import faiss
import numpy as np
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
from sentence_transformers import SentenceTransformer
from langchain.schema import Document
from dotenv import load_dotenv
import google.generativeai as genai

# ---------------------------
# PDF & OCR Utilities
# ---------------------------
def pdf_to_images(pdf_path):
    return convert_from_path(pdf_path, dpi=200)

def ocr_image(image: Image.Image):
    return pytesseract.image_to_string(image)

def ocr_pdf(pdf_path):
    images = pdf_to_images(pdf_path)
    return [ocr_image(img) for img in images]

# ---------------------------
# Text Chunking
# ---------------------------
def chunk_text(text, chunk_size=400, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def chunk_pdf_texts(texts, filename):
    all_chunks = []
    for page_no, text in enumerate(texts, 1):
        for chunk in chunk_text(text):
            all_chunks.append({
                "text": chunk,
                "metadata": {"filename": filename, "page_no": page_no}
            })
    return all_chunks

# ---------------------------
# Embeddings + FAISS
# ---------------------------
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_local_embedding(text):
    return model.encode(text)

def build_faiss_index(chunks):
    embeddings = [get_local_embedding(chunk['text']) for chunk in chunks]
    embeddings = np.array(embeddings).astype('float32')
    faiss.normalize_L2(embeddings)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings)
    return index

def search_faiss(query, index, chunks, k=5):
    query_vector = model.encode([query])
    faiss.normalize_L2(query_vector)
    D, I = index.search(query_vector.astype('float32'), k)
    return [chunks[i] for i in I[0] if i != -1]

# ---------------------------
# API key setup
# ---------------------------
load_dotenv() 
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("❌ GOOGLE_API_KEY not found in .env file")

genai.configure(api_key=api_key)

class ChatService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.chat = self.model.start_chat(history=[])

    def ask(self, prompt):
        response = self.chat.send_message(prompt)
        return response.text

# ---------------------------
# Topic Summarizer
# ---------------------------
def generate_topic_breakdown(chunks, chat):
    summaries = []
    for chunk in chunks:
        prompt = f"Summarize the following into clear topic headings + 2-3 bullet points:\n\n{chunk['text']}"
        summaries.append(chat.ask(prompt))
    return summaries

# ---------------------------
# Practice Questions
# ---------------------------
def generate_mcqs(chunk, chat):
    prompt = f"Generate 3 multiple-choice questions with answers from the following text:\n\n{chunk['text']}"
    return chat.ask(prompt)

def practice_mode(chat, chunk):
    while True:
        mcqs = generate_mcqs(chunk, chat)
        print("\nPractice Questions:\n", mcqs)

        user_ans = input("Your answer (or 'quit' to stop): ")
        if user_ans.lower() == "quit":
            break
        # Ask Gemini if the answer is correct
        feedback = chat.ask(f"The student answered: {user_ans}. Was it correct? If not, explain briefly.")
        print(feedback)

# ---------------------------
# Retriever + Chatbot
# ---------------------------
class LocalRetriever:
    def __init__(self, index, chunks):
        self.index = index
        self.chunks = chunks

    def get_relevant_documents(self, query):
        results = search_faiss(query, self.index, self.chunks)
        return [Document(page_content=chunk['text'], metadata=chunk['metadata']) for chunk in results]

def chatbot_mode(query, retriever, chat):
    docs = retriever.get_relevant_documents(query)
    context = "\n\n".join([doc.page_content for doc in docs])
    prompt = f"Given the following lecture notes:\n{context}\n\nAnswer the question: {query}"
    return chat.ask(prompt)

# ---------------------------
# MAIN PIPELINE
# ---------------------------
if __name__ == "__main__":
    pdf_path = "/Users/ritvikvr/Downloads/lectureNotes-chatbot/LSTM  GRU.pdf" 
    filename = os.path.basename(pdf_path)

    # Step 1: OCR
    texts = ocr_pdf(pdf_path)

    # Step 2: Chunking
    chunks = chunk_pdf_texts(texts, filename)

    # Step 3: FAISS Index
    index = build_faiss_index(chunks)

    # Step 4: Gemini Chat
    chat = ChatService()
    retriever = LocalRetriever(index, chunks)

    # ---- DEMOS ----
    print("=== TOPIC BREAKDOWN ===")
    topics = generate_topic_breakdown(chunks[:2], chat)  # first 2 chunks
    for t in topics:
        print(t)

    print("\n=== PRACTICE MODE ===")
    practice_mode(chat, chunks[0])

    print("\n=== CHATBOT MODE ===")
    query = "Explain:"
    print(chatbot_mode(query, retriever, chat))
