from django.shortcuts import render
from rest_framework import generics 
from .models import Member
from .serializers import MemberSerializer

class MemberList(generics.ListCreateAPIView):
    queryset=Member.objects.all()
    serializer_class=MemberSerializer
    
class MemberDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=Member.objects.all()
    serializer_class=MemberSerializer


# Create your views here.
