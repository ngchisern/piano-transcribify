import re


class ProgressStream:
    def __init__(self, task, original_stream):
        self.task = task
        self.original_stream = original_stream
        self.progress = 0

    def write(self, s):
        self.original_stream.write(s)

        match = re.search(r'Segment (\d+) / (\d+)', s)
        if not match:
            return

        current, total = map(int, match.groups())
        self.task.update_state(state='PROGRESS',
                               meta={'current': current, 'total': total})

    def flush(self):
        self.original_stream.flush()
