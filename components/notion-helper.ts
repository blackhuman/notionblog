import type { Page, TitlePropertyValue, ParagraphBlock, Block } from '@notionhq/client/build/src/api-types'

export function extractPageTitle(page: Page): string {
  let pageNameProp = page.properties['Name'] as TitlePropertyValue
  return pageNameProp.title.map(meta => meta.plain_text)[0] ?? 'Untitled'
}

export function extractTextFromParagraph(block: ParagraphBlock): string {
  // @ts-ignore
  let texts = block.paragraph.text as RichText[]
  return texts.map(t => t.plain_text).join('')
}