import strawberry


@strawberry.type
class Query:
    hello: str


from typing import AsyncGenerator

import strawberry
from channels.layers import get_channel_layer
from strawberry.channels import StrawberryChannelsContext
from strawberry.types import Info


@strawberry.input
class ChatRoom:
    id: str


@strawberry.type
class ChatRoomMessage:
    id: str
    message: str


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def send_chat_message(
        self,
        room: ChatRoom,
        message: str,
    ) -> None:
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            f"chat-room-{room.id}",
            {
                "type": "chat.message",
                "room_id": room.id,
                "message": message,
            },
        )


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def join_chat_rooms(
        self,
        info: Info[StrawberryChannelsContext, None],
        rooms: list[ChatRoom],
    ) -> AsyncGenerator[ChatRoomMessage, None]:
        """Join and subscribe to messages sent to the given rooms."""
        ws = info.context.request
        rooms = [f"chat-room-{room.id}" for room in rooms]
        channel_layer = ws
        for group in channel_layer.groups:
            await channel_layer.group_send(
                group,
                {
                    "type": "chat.message",
                    "room_id": group.split("-")[-1],
                    "message": f"{self.channel_name} just joined the room!",
                },
            )
        async for message in ws.channel_listen("chat.message", groups=rooms):
            yield ChatRoomMessage(
                id=message["room_id"],
                message=message["message"],
            )


schema = strawberry.Schema(query=Query, mutation=Mutation, subscription=Subscription)
