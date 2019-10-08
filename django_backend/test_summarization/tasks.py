from .deep_backend.Press import Press
from test_summarization.celery import app


@app.task(bind=True)
def summarize_text(self, original_text, number_of_sentences):
    self.update_state(state='PROGRESS')
    summary = Press(original_text, number_of_sentences)
    index_sentence_dict = [{'id': index + 1, 'text': sentence} for (index, sentence) in enumerate(summary)]
    print(index_sentence_dict)
    self.update_state(state='DONE')