#!/usr/bin/env sh

cat input.txt | elm repl --no-colors 2> error.txt 1> output.txt;

