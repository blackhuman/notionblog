import { useRouter } from 'next/router'
import { Client } from '@notionhq/client'
import type { GetStaticProps } from 'next'
import { ParagraphBlock, RichText, TitlePropertyValue } from '@notionhq/client/build/src/api-types'

export default function Page({ title, blocks }) {
  const router = useRouter()
  const { pid } = router.query
  return (
    <div>
      <p>{title}</p>
      {blocks
        .map((block: ParagraphBlock) => extractTextFromParagraph(block))
        .map((text: string) => <p>{text}</p>)}
    </div>
  )
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

function extractTextFromParagraph(block: ParagraphBlock): string {
  // @ts-ignore
  let texts = block.paragraph.text as RichText[]
  return texts.map(t => t.plain_text).join('')
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let pid = params.pid as string
  let pageMetaResponse = await notion.pages.retrieve({
    page_id: pid
  })
  let pageTitleMeta = pageMetaResponse.properties['Name'] as TitlePropertyValue
  let pageTitle = pageTitleMeta.title.map(text => text.plain_text)[0] ?? 'Untitled'
  let blocksResponse = await notion.blocks.children.list({
    block_id: pid
  })
  return {
    props: {
      title: pageTitle,
      blocks: blocksResponse.results
    }
  }
}

export async function getStaticPaths() {
  let response = await notion.databases.query({
    database_id: 'b66f3740-ab1e-425b-a321-a806febd5f71'
  })
  let pages = response.results
  return {
    paths: pages.map(page => {
      return { params: { pid: page.id } }
    }),
    fallback: false
  };
}
