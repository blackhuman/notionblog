import { useRouter } from 'next/router'
import { 
  retrievePages, retrievePage, retrieveBlocks
} from 'components/notion'
import { extractPageTitle, extractTextFromParagraph } from 'components/notion-helper'

import type { GetStaticProps } from 'next'
import type { ParagraphBlock } from 'components/notion'

export async function getStaticPaths() {
  let preRenderPIDs = (await retrievePages()).map(page => page.id)
  return {
    paths: preRenderPIDs.map(pid => {
      return { params: { pid: pid }}
    }),
    fallback: true
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let pid = params.pid as string
  let page = await retrievePage(pid)
  let pageTitle = extractPageTitle(page)
  let blocks = await retrieveBlocks(pid)
  return {
    props: {
      title: pageTitle,
      blocks: blocks
    },
    revalidate: 5
  }
}

export default function Page({ title, blocks }) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <p>{title}</p>
      {blocks
        .map((block: ParagraphBlock) => {
          let text = extractTextFromParagraph(block)
          return <p key={block.id}>{text}</p>
        })}
    </div>
  )
}
