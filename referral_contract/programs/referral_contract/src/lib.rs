use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("4uL34WQ31gYhMjkks7bUd9yx2TYztvj2iUp9BjXvpnQg");

#[program]
pub mod referral_contract {
    use super::*;

    pub fn send_token(ctx: Context<SendToken>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, amount)
    }
}

#[derive(Accounts)]
pub struct SendToken<'info> {
    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,

    /// The signer who owns the `from_token_account`
    pub authority: Signer<'info>,

    /// The SPL Token program
    pub token_program: Program<'info, Token>,
}