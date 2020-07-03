import datetime
import os


# TODO implement check with poap API (check name and id
def valid_poap_event(poap_event):
    return True


def generate_unique_filename(path):
    def wrapper(instance, filename):
        head, ext = os.path.splitext(filename)
        # get filename
        if instance.pk:
            filename = filename
        else:
            # set filename with the unix epoch appended
            unix_epoch_millis = datetime.datetime.now().timestamp() * 1000000
            filename = f"{head}{unix_epoch_millis:.0f}{ext}"
        # return the whole path to the file
        return os.path.join(path, filename)
    return wrapper
