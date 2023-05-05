from typing import List
import re
import PyPDF2


heading_lines = 5


def get_sentences(filePath: str) -> List[str]:
    text = read_pdf_contents(filePath)
    sentences = split_into_sentences(text)
    return sentences


def sanitize_text_list(text_list):
    sanitized_list = []
    for text in text_list:
        sanitized_text = re.sub(r'\s+', ' ', text).strip()
        sanitized_list.append(sanitized_text)
    return sanitized_list


def split_into_sentences(text: str) -> List[str]:
    list_of_strings = text.split(".")
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
