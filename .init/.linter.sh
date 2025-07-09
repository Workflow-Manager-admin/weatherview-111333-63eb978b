#!/bin/bash
cd /home/kavia/workspace/code-generation/weatherview-111333-63eb978b/weather_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

