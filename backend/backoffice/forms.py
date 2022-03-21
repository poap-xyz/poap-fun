from django import forms
from django.core.exceptions import ValidationError

from core.models import Raffle

class RaffleMultiJoinForm(forms.Form):
    raffle = forms.ModelChoiceField(Raffle.objects, required=True, empty_label='Select a Raffle')
    addresses = forms.CharField(widget=forms.Textarea)

    def __init__(self, *args, **kwargs):
        super(RaffleMultiJoinForm, self).__init__(*args, **kwargs)
        # Filter active raffles
        self.fields['raffle'].queryset = Raffle.objects.filter(finalized=False, published=True)

        # Add some styling
        self.fields['raffle'].widget.attrs['class'] = 'form-control'
        self.fields['addresses'].widget.attrs['class'] = 'form-control'

    def clean_raffle(self):
        raffle = self.cleaned_data['raffle']
        if raffle.finalized:
            raise ValidationError("Please select an active raffle")
        return raffle

