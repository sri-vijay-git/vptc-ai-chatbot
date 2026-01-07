"""
Monkey-patch to fix ChromaDB's ONNX runtime issue on Windows
This must be imported before chromadb
"""
import sys
from unittest.mock import MagicMock

# Mock onnxruntime to prevent DLL errors
sys.modules['onnxruntime'] = MagicMock()

# Now patch the DefaultEmbeddingFunction
import chromadb.utils.embedding_functions as ef

class DummyDefaultEmbedding:
    """Dummy embedding function to replace ONNX-based default"""
    def __call__(self, input):
        if isinstance(input, str):
            input = [input]
        return [[0.0] * 768 for _ in input]

# Replace the default embedding function
ef.DefaultEmbeddingFunction = lambda: DummyDefaultEmbedding()
