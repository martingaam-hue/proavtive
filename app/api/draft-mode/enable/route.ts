// Draft Mode enable route for Sanity Presentation tool.
// Called by the Presentation iframe when an editor opens a preview.
// SANITY_API_READ_TOKEN must have Editor-or-above permissions (viewer is insufficient).
// See CONTEXT D-22 / RESEARCH Pattern 8 / UI-SPEC §6.2.
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/lib/sanity.client'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_API_READ_TOKEN,
  }),
})
