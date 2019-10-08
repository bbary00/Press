from .serializers import UserSerializer, UserSerializerWithToken
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .deep_backend.Press import Press
from test_summarization.tasks import summarize_text


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    serializer = UserSerializer(request.user)
    print(serializer.data)
    return Response(serializer.data)


class TextSummarizedApi(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        original_text = request.data.get('original_text')
        number_of_sentences = int(request.data.get('number_of_sentences')) if request.data.get('number_of_sentences') else None
        summarized_text = Press(original_text, number_of_sentences)
        index_sentence_dict = [{'id': index+1, 'text': sentence} for (index, sentence) in enumerate(summarized_text)]
        # summarize_text.apply_async(args=[original_text, number_of_sentences])
        return Response({'summary_text': index_sentence_dict})


class UserApi(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        print(serializer.initial_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
