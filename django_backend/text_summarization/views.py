from text_summarization.serializers import UserSerializer, \
                                           UserRegisterSerializer, \
                                           TextSummarizationSerializer
from rest_framework import permissions, status, generics, mixins
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .deep_backend.Press import Press
from django.contrib.auth import get_user_model
from .models import SummarizedText
from django.db.models import Sum




class CabinetView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = self.request.user.id
        user = UserSerializer(request.user).data
        count_of_summaries = {"count_of_summaries": SummarizedText.objects.filter(user_id=user_id).count()}
        words_saved = SummarizedText.objects.filter(user_id=user_id).aggregate(Sum('word_difference'))
        last_10 = {'last_10': list(SummarizedText.objects.filter(user_id=user_id).values("full_text", "summarized_text")[:10])}
        return Response({**user, **count_of_summaries, **words_saved, **last_10})


# TODO Change text view
class TextSummarizationApiView(generics.CreateAPIView):

    permission_classes = (permissions.AllowAny,)
    serializer_class = TextSummarizationSerializer

    def post(self, request, *args, **kwargs):
        original_text = request.data.get('full_text')
        number_of_sentences = int(request.data.get('number_of_sentences')) if request.data.get('number_of_sentences') else None
        summarized_text, word_difference = Press(original_text, number_of_sentences)
        index_sentence_dict = [{'id': index+1, 'text': sentence} for (index, sentence) in enumerate(summarized_text)]
        # summarize_text.apply_async(args=[original_text, number_of_sentences])
        if not request.user.is_anonymous:
            request.data.update({'user': request.user.id,
                                'full_text': original_text,
                                'summarized_text': ' '.join(summarized_text),
                                'number_of_summarized_sentences': len(summarized_text),
                                'word_difference': word_difference})
            self.create(request)
        return Response({'summary_text': index_sentence_dict})

    def create(self, request, *args, **kwargs):
        write_serializer = TextSummarizationSerializer(data=request.data)
        if not write_serializer.is_valid():
            return Response({'error': 'check parameters'})
        instance = self.perform_create(write_serializer)
        return Response(instance)


    # def get_queryset(self, *args, **kwargs):
    #     user_id = self.request.user.id
    #     if not user_id:
    #         return SummarizedText.objects.none()
    #     return SummarizedText.objects.filter(user_id=user_id)


class UserApiView(generics.CreateAPIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer
    queryset = get_user_model().objects.all()

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
