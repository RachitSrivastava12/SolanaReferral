export default {
  "address": "4uL34WQ31gYhMjkks7bUd9yx2TYztvj2iUp9BjXvpnQg",
  "metadata": {
    "name": "referral_contract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "send_token",
      "discriminator": [
        157,
        183,
        177,
        53,
        196,
        251,
        54,
        185
      ],
      "accounts": [
        {
          "name": "from_token_account",
          "writable": true
        },
        {
          "name": "to_token_account",
          "writable": true
        },
        {
          "name": "authority",
          "docs": [
            "The signer who owns the `from_token_account`"
          ],
          "signer": true
        },
        {
          "name": "token_program",
          "docs": [
            "The SPL Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ]
};