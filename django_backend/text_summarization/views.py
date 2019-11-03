from text_summarization.serializers import UserSerializer, \
                                           UserRegisterSerializer, \
                                           TextSummarizationSerializer
from rest_framework import permissions, status, generics, mixins
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .deep_backend.Press import Press
from django.contrib.auth import get_user_model


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# TODO Change text view
class TextSummarizationApiView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = TextSummarizationSerializer

    def post(self, request, *args, **kwargs):
        original_text = request.data.get('full_text')
        number_of_sentences = int(request.data.get('number_of_sentences')) if request.data.get('number_of_sentences') else None
        summarized_text = Press(original_text, number_of_sentences)
        index_sentence_dict = [{'id': index+1, 'text': sentence} for (index, sentence) in enumerate(summarized_text)]
        # summarize_text.apply_async(args=[original_text, number_of_sentences])
        return Response({'summary_text': index_sentence_dict})


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
