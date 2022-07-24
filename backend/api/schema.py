import asyncio
from typing import AsyncGenerator

import strawberry


@strawberry.type
class Query:
    hello: str


@strawberry.type
class Mutation:
    ...


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def timer_updated(
        self,
    ) -> AsyncGenerator[int, None]:
        total = 100

        while True:
            total -= 1

            yield total

            await asyncio.sleep(1)


schema = strawberry.Schema(query=Query, subscription=Subscription)
