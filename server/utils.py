import re
import PyPDF2
import docx
import openai


heading_lines = 5


def get_embedding(text, model="text-embedding-ada-002"):
    return openai.Embedding.create(input=[text], model=model)['data'][0]['embedding']


def extract_docx_text(file_path):
    doc = docx.Document(file_path)
    full_text = []

    for paragraph in doc.paragraphs:
        full_text.append(paragraph.text)

    return '\n'.join(full_text)


def get_sentences(filePath: str) -> list[str]:
    text = read_pdf_contents(filePath)
    sentences = split_into_sentences(text)
    return sentences


def sanitize_text_list(text_list: list[str]):
    sanitized_list = []
    for text in text_list:
        sanitized_text = re.sub(r'\s+', ' ', text).strip()
        sanitized_list.append(sanitized_text)
    return sanitized_list


def split_text_into_chunks(text, min_sentences=3):
    sentences = text.split('.')
    chunks = []

    chunk = ""
    count = 0
    for sentence in sentences:
        sentence = sentence.strip()
        if sentence:
            chunk += sentence + '. '
            count += 1

            if count >= min_sentences:
                chunks.append(chunk.strip())
                chunk = ""
                count = 0

    # Append the last chunk if there are any remaining sentences
    if chunk.strip():
        chunks.append(chunk.strip())

    return chunks


def split_into_sentences(text: str) -> list[str]:
    list_of_strings = split_text_into_chunks(text)
    sanitized_text = sanitize_text_list(list_of_strings)
    return sanitized_text


def read_pdf_contents(filePath: str):
    with open(filePath, "rb") as file:
        pdfFileReader = PyPDF2.PdfReader(file)
        print("\n\n", "No. Of Pages:", len(pdfFileReader.pages), "\n\n")
        text = ""

        for pageNumber in range(len(pdfFileReader.pages)):
            pageObject = pdfFileReader.pages[pageNumber]
            current_page_text = pageObject.extract_text()
            text += remove_headline(current_page_text)

        return text


def remove_headline(text: str) -> str:
    text_lines = text.split("\n")
    return "\n".join(text_lines[heading_lines:])
