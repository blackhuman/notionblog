
import { Client } from '@notionhq/client'
import type { Page, TitlePropertyValue, ParagraphBlock, Block } from '@notionhq/client/build/src/api-types'

export type { Page, ParagraphBlock }

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function retrievePages(): Promise<Page[]> {
  let response = await notion.databases.query({
    database_id: 'b66f3740-ab1e-425b-a321-a806febd5f71'
  })
  return response.results
}

export async function retrievePage(pid: string): Promise<Page> {
  return await notion.pages.retrieve({
    page_id: pid
  })
}

export async function retrieveBlocks(pid: string): Promise<Block[]> {
  let response = await notion.blocks.children.list({
    block_id: pid
  })
  return response.results
}
