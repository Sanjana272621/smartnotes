import json
import os


from main import ChatService, LocalRetriever, build_faiss_index, chunk_pdf_texts, ocr_pdf

# ----------------------------
# Generate JSON output
# ----------------------------
def generate_json_output(pdf_path, queries, output_file="results.json"):
    # OCR + Chunking
    filename = os.path.basename(pdf_path)
    texts = ocr_pdf(pdf_path)
    chunks = chunk_pdf_texts(texts, filename)

    # Build FAISS Index
    retriever = LocalRetriever(index, chunks)
    gemini_chat = ChatService()

    # Collect results
    results = {"pdf": filename, "queries": []}

    for query in queries:
        docs = retriever.get_relevant_documents(query)
        context = "\n\n".join([doc.page_content for doc in docs])
        final_response = gemini_chat.ask(
            f"Given the following context, answer this: {query}\n\n{context}"
        )
        results["queries"].append({
            "query": query,
            "answer": final_response,
            "context_chunks": [doc.page_content for doc in docs]
        })

    # Save as JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4, ensure_ascii=False)

    print(f" Results saved to {output_file}")


# ----------------------------
# Run Example
# ----------------------------
if __name__ == "__main__":
    pdf_path = "/Users/ritvik/Library/Mobile Documents/com~apple~CloudDocs/Documents/Personal/smartnotes/backend/LSTM  GRU.pdf"
    queries = [
        "What is LSTM?",
        "What is GRU?"
    ]
    generate_json_output(pdf_path, queries, output_file="results.json")
