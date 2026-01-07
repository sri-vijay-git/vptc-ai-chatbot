import PyPDF2
from typing import List

class PDFService:
    def extract_text_from_pdf(self, file_path: str) -> str:
        """
        Reads a PDF file and extracts all text content.
        """
        text = ""
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"Error reading PDF {file_path}: {e}")
            return ""
        return text

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """
        Splits text into manageable chunks for embedding.
        Simple recursive character splitting strategy logic.
        """
        chunks = []
        start = 0
        text_len = len(text)

        while start < text_len:
            end = start + chunk_size
            
            # If we are not at the end of the text, try to find the last period or newline to break cleanly
            if end < text_len:
                # Look for the last matching delimiter within the last 100 chars of the chunk
                # to avoid breaking words or sentences awkwardly.
                found_split = -1
                for split_char in ['.', '\n', ' ']:
                    last_occurrence = text.rfind(split_char, start, end)
                    if last_occurrence != -1 and last_occurrence > start + (chunk_size * 0.8):
                        found_split = last_occurrence
                        break
                
                if found_split != -1:
                    end = found_split + 1  # Include the delimiter

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            # Move start forward, accounting for overlap
            start = end - overlap
            
            # Prevent infinite loops if no progress is made (e.g. huge contiguous block without delimiters)
            if start >= end:
                start = end

        return chunks

pdf_service = PDFService()
