from rest_framework.exceptions import ValidationError


def validate_image_size(image):
    file_size = image.file.getbuffer().nbytes
    limit_mb = 8
    if file_size > limit_mb * 1024 * 1024:
       raise ValidationError("Max size of file is %s MB" % limit_mb)
