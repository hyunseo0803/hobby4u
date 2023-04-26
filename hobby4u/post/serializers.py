from rest_framework import serializers
from .models import Member

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        fields=(
            'id',
            'email',
            'nickname',
        )
        model=Member