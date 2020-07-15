import datetime
import os
from django.utils.deconstruct import deconstructible




@deconstructible
class GenerateUniqueFilename(object):

    def __init__(self, sub_path):
        self.path = sub_path

    def __call__(self, instance, filename):
        head, ext = os.path.splitext(filename)
        # get filename
        if instance.pk:
            filename = filename
        else:
            # set filename with the unix epoch appended
            unix_epoch_millis = datetime.datetime.now().timestamp() * 1000000
            filename = f"{head}{unix_epoch_millis:.0f}{ext}"
        # return the whole path to the file
        return os.path.join(self.path, filename)


generate_unique_filename = GenerateUniqueFilename('text_editor_images/')
