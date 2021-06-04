import json

from web3 import Web3
from web3.auto import w3

from core.models import Raffle


class RaffleMultipleJoinService:

    @staticmethod
    def set_task_with_error(task, msg):
        task.result = msg
        task.state = 'ERROR'
        task.save()

    @staticmethod
    def set_task_complete(task, msg):
        task.result = msg
        task.state = 'COMPLETE'
        task.save()

    @staticmethod
    def set_task_in_progress(task):
        task.state = 'IN_PROGRESS'
        task.save()

    @staticmethod
    def join_participants(raffle, addresses):
        from core.serializers import MultiParticipantSerializer
        results = []

        for each in addresses:
            print('Starting', each)
            try:
                address = each.strip().lower()
                if not Web3.isAddress(address):
                    resolved_address = w3.ens.address(address)
                    if not resolved_address or not Web3.isAddress(resolved_address):
                        error_msg = 'Could not join participant: {} > Invalid address/ENS'.format(address)
                        results.append(error_msg)
                        continue
                    else:
                        address = resolved_address.lower()
                if address and Web3.isAddress(address):
                    # Validate address & check if ENS
                    data = {
                        'address': address,
                        'signature': 'Participant added by raffle organizers',
                        'message': 'Participant added by raffle organizers',
                        'raffle_id': raffle.id,
                        'email': '' if not raffle.email_required else 'invalid@email.com'
                    }
                    serializer = MultiParticipantSerializer(data=data)
                    if serializer.is_valid():
                        serializer.save()
                        continue

                error_msg = 'Could not join participant: {}'.format(each)
                results.append(error_msg)
            except Exception as e:
                error_msg = 'Could not join participant: {}'.format(each)
                print('Error joining participant >> {} >> {}'.format(each, e))
                results.append(error_msg)

        return json.dumps(results)

    def process(self, task):

        if task.state != 'CREATED':
            self.set_task_with_error(task, 'Invalid task state: {}'.format(task.state))
            return

        self.set_task_in_progress(task)

        params = json.loads(task.params)

        raffle = Raffle.objects.filter(id=params['raffle_id']).first()

        if not raffle:
            self.set_task_with_error(task, 'Raffle not found')
            return

        if raffle.finalized:
            self.set_task_with_error(task, 'Raffle already ended')
            return

        # JOIN WHATEVER WE CAN
        if not params['addresses']:
            self.set_task_with_error(task, 'Addresses params not found')
            return

        result = self.join_participants(raffle, params['addresses'])

        self.set_task_complete(task, result)

