# ZapMe
PoC of LUD-06(LUD-16) w/ NIP-57.

works w/ [jb55/cln-nostr-zapper](https://github.com/jb55/cln-nostr-zapper).

You need
- [ElementsProject/lightning](https://github.com/ElementsProject/lightning)
- [fiatjaf/sparko](https://github.com/fiatjaf/sparko)
- [jb55/cln-nostr-zapper](https://github.com/jb55/cln-nostr-zapper)

Also you need `<DOMAIN>/.well-known/lnurlp/<USERNAME>` file with below example.
```json
{
    "tag": "payRequest",
    "callback": "https://<ZapMe Domain>/api/v1/lnurl/payreq",
    "minSendable": 1000,
    "maxSendable": 100000000000,
    "metadata": "[[\"text/plain\", \"<Text you want to show>\"]]",
    "allowsNostr": true,
    "nostrPubkey": "<cln-nostr-zapper's public key(hex)>"
}
```
