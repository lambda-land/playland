module InteropDefinitions exposing (Flags, FromElm(..), ToElm(..), interop)

import Json.Encode
import TsJson.Decode as TsDecode exposing (Decoder)
import TsJson.Encode as TsEncode exposing (Encoder, optional, required)


interop :
    { toElm : Decoder ToElm
    , fromElm : Encoder FromElm
    , flags : Decoder Flags
    }
interop =
    { toElm = toElm
    , fromElm = fromElm
    , flags = flags
    }


type FromElm
    = Alert String
    | Display String 
    | Log String


type ToElm
  = AuthenticatedUser User
  | EvaluationRequest EvalPackage 
  | EvaluationResponse String

type alias User 
  = { username : String }
type alias EvalPackage = 
  { source : String
  , expr : String
  }

type alias Flags =
    {}


fromElm : Encoder FromElm
fromElm =
    TsEncode.union
        (\vAlert vDisplay vLog value ->
            case value of
                Alert string -> vAlert string
                Display string -> vDisplay string
                Log string -> vLog string
        )
        |> TsEncode.variantTagged "alert" 
          (TsEncode.object [ required "message" identity TsEncode.string ])
        |> TsEncode.variantTagged "display"
          (TsEncode.object [ required "message" identity TsEncode.string ])
        |> TsEncode.variantTagged "log"
          (TsEncode.object [ required "message" identity TsEncode.string ])
        |> TsEncode.buildUnion


toElm : Decoder ToElm
toElm =
    TsDecode.discriminatedUnion "tag" toElmDecoders
        -- [ ("authenticatedUser"
        --   , TsDecode.map AuthenticatedUser 
        --       (TsDecode.map User (TsDecode.field "username" TsDecode.string))
        --   )
        -- ]

-- decodeRecord : List (String,Decoder t) -> (rec -> obj) -> Decoder obj
-- decodeRecord fields cons = List.foldl (\) TsDecode.succeed cons 

toElmDecoders : List (String,Decoder ToElm)
toElmDecoders = 
  [ ( "evaluateExpression"
    , TsDecode.succeed EvalPackage
        |> TsDecode.andMap (TsDecode.field "source" TsDecode.string)
        |> TsDecode.andMap (TsDecode.field "expr" TsDecode.string)
        |> TsDecode.map EvaluationRequest
    )
  , ( "evaluationResponse"
    , TsDecode.map EvaluationResponse (TsDecode.field "value" TsDecode.string)
    )
  , ( "authenticatedUser"
    , TsDecode.succeed User
        |> TsDecode.andMap (TsDecode.field "username" TsDecode.string)
        |> TsDecode.map AuthenticatedUser 
    )
  ]

flags : Decoder Flags
flags =
    TsDecode.null {}
