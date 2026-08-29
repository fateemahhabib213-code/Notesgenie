from pypdf import PdfReader


class DocumentExtractionError(Exception):
    """Raised when text cannot be extracted from a document."""
    pass


def extract_text_from_txt(file_path: str) -> str:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    except UnicodeDecodeError:
        raise DocumentExtractionError(
            "Could not read the text file. Make sure it is UTF-8 encoded."
        )

    text = text.strip()
    if not text:
        raise DocumentExtractionError("The uploaded text file is empty.")

    return text


def extract_text_from_pdf(file_path: str) -> str:
    try:
        reader = PdfReader(file_path)
    except Exception as e:
        raise DocumentExtractionError(f"Could not open the PDF file: {e}")

    pages_text = []
    pages_with_no_text = 0

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text and page_text.strip():
            pages_text.append(page_text.strip())
        else:
            pages_with_no_text += 1

    full_text = "\n\n".join(pages_text).strip()

    if not full_text:
        raise DocumentExtractionError(
            "No readable text was found in this PDF. "
            "It may be a scanned document (image-based) with no selectable text."
        )

    return full_text


def extract_text(file_path: str, file_type: str) -> str:
    if file_type == ".txt":
        return extract_text_from_txt(file_path)
    elif file_type == ".pdf":
        return extract_text_from_pdf(file_path)
    else:
        raise DocumentExtractionError(f"Unsupported file type: {file_type}")