import os

from api.schema import schema
from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application
from strawberry.channels import GraphQLProtocolTypeRouter

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pomoberry.settings")

django_asgi_app = get_asgi_application()

application = GraphQLProtocolTypeRouter(
    schema,
    django_application=django_asgi_app,
)
