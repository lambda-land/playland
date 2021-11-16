module Types exposing (..)
import Html exposing (Html, node)

type Language = Elm | Bogl

type alias Editor = 
  { node : node
  , readOnly : Bool
  , language : Language
  }