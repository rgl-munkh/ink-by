import { MainLayout, PageWrapper, Header, HeaderTitle } from "@/components/layout"
import { DesignShowcase } from "@/components/design-system"

export default function Home() {
  return (
    <MainLayout>
      <Header>
        <HeaderTitle>Ink By - Design System</HeaderTitle>
      </Header>
      <PageWrapper>
        <DesignShowcase />
      </PageWrapper>
    </MainLayout>
  )
}
