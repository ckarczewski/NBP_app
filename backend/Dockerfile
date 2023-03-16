FROM python:3.9.5-slim

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y \
    && apt-get install dnsutils -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    gcc \
    libc-dev \
    bash \
    git \  
    && pip3 install --upgrade pip

ENV LIBRARY_PATH=/lib:/usr/lib

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /.

COPY ./ ./

EXPOSE 8000

RUN pip3 freeze > requirements.txt
RUN pip3 install Django
RUN pip3 install psycopg2-binary
RUN pip3 install django-cors-headers
RUN pip3 install django-environ
RUN python3 -m pip --no-cache-dir install -r requirements.txt
CMD python manage.py runserver 0.0.0.0:8000