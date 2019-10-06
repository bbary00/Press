from .models import SummarizedText
from .transforming import summarize
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response


class TextSummarizedApi(APIView):
    def post(self, request):
        original_text = request.data.get('original_text')
        number_of_sentences = request.data.get('number_of_sentences')
        percentage_of_length = request.data.get('percentage')
        summarized_text = summarize(original_text, number_of_sentences, percentage_of_length)
        index_sentence_dict = [{'id': index+1, 'text': sentence} for (index, sentence) in enumerate(summarized_text)]

        return Response({'summary_text': index_sentence_dict})
