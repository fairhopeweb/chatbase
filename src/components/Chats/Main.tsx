import { MainContainer } from '@chatscope/chat-ui-kit-react'
import { Layout, Spin, Typography } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import useChatStyles from '../../hooks/useChatStyles'
import useHandleConversationsData from '../../hooks/useHandleConversationsData'
import useSubscription from '../../hooks/useSubscription'
import { supabase } from '../../services/supabase'
import { UserProfile } from '../../utils/types'
import ChatRoom from './ChatRoom'
import Sidebar from './Sidebar'

interface Props {
  toggle: React.FC,
  user?: UserProfile
}

export default function ({ toggle, user }: Props) {
  const { init, payload } = useSubscription()
  const [unreadCount, setUnreadCount] = useState<{[id: string]: number}>()

  const { loadingMessage } = useHandleConversationsData(
    user, payload, unreadCount, setUnreadCount)

  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth < 576)
  const { style } = useChatStyles(sidebarVisible)

  useEffect(() => {
    const setMaxHeight = () => {
      // document.body.style.height = '100vh'
      // document.body.style.height = 'calc(var(--vh, 1vh) * 100)'

      const vh = window.innerHeight * 0.01
      const element = document.querySelector('.cs-main-container.main-chat') as HTMLElement
      if (element) {
        console.log(vh)
        element.style.setProperty('--vh', `${vh}px`)
        // document.body.style.setProperty('--vh', `${vh}px`)
      }
    }
    setMaxHeight()

    window.addEventListener('resize', () => {
      setSidebarVisible(window.innerWidth < 576)

      // setMaxHeight()
    })
  }, [])

  useEffect(() => {
    init()
    return () => {
      supabase.removeAllSubscriptions()
    }
  }, [])

  return <MainContainer className="main-chat" responsive>
    <Sidebar
      user={user}
      toggle={toggle}
      payload={payload}
      unreadCount={unreadCount}
      setUnreadCount={setUnreadCount}
      handleConversationClick={useCallback(() => {
        if (sidebarVisible) {
          setSidebarVisible(false)
        }
      }, [sidebarVisible])}
      style={style} />

    {loadingMessage ? <Layout className="main-wrapper" style={{ textAlign: 'center', paddingTop: '200px' }}>
      <Typography.Paragraph>
        <Spin spinning />
      </Typography.Paragraph>
    </Layout> : <ChatRoom user={user} style={style} sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} />}
  </MainContainer>
}