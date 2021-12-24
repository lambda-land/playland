module Interop exposing (..)


import InteropPorts  

toElm = InteropPorts.toElm
send = fromElm
fromElm = InteropPorts.fromElm
receive = toElm
decodeFlags = InteropPorts.decodeFlags