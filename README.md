# Searching Documents Using Natural Language

This project is a web application that offers a modern user interface for uploading and searching documents using natural language. It consists of two main components: a Vite React app for the user interface, and a Python Flask server for handling all the logic.

![photo of the app](https://user-images.githubusercontent.com/36008268/236631396-a9ecd9fa-bf9c-454d-a3e1-202ce7835d51.png)

## Folder Structure

The project is organized into two main folders:

ui: Contains the Vite React app for the user interface. Users can upload documents and search through them using an intuitive, modern UI.
server: Contains the Python Flask server, which has several endpoints defined for fetching already indexed documents, indexing new documents using the OpenAI embeddings API, and searching documents using natural language.

## Getting Started

Follow these steps to set up the project and run it locally:

Prerequisites
Make sure you have Node.js (version 18.x or later) and Python (version 3.7 or later) installed on your system.

### UI Setup

From the project root navigate to the ui folder:

```bash
cd ui
```

Install the dependencies:

```bash
npm install
```

Start the Vite React app:

```bash
npm run dev
```

The app should now be running at http://localhost:5173.

Server Setup
From the project root, navigate to the server folder:

```bash
cd server
```

(Optional) Create a virtual environment:

```bash
python -m venv embeddings-search
```

Activate the virtual environment:
On macOS and Linux:

```bash
source my_project_env/bin/activate
```

On Windows:

```bash
.\my_project_env\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a .env file in the server folder and add your OpenAI API key:
OPENAI_API_KEY=your_openai_api_key_here

Start the Flask server:

```bash
python app.py
```

The server should now be running at http://localhost:5000.

Usage
With both the UI and server running, you can now access the web application at http://localhost:5173. Upload documents and search through them using natural language queries.
