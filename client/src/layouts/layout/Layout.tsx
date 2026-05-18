import { Outlet } from "react-router-dom"
import { Layout } from 'antd';
import { AppHeader } from "../header/AppHeader";
import { FooterPage } from "../footer/Footer";
import styles from "./styles.module.scss";

const { Footer, Content } = Layout;
 
export const LayoutPage = () => {
    return(
        <>
            <Layout className={styles.layout}>
                <AppHeader />
                <Content className={styles.content}>
                    <Outlet/>
                </Content>
                <Footer className={styles.footer}>
                    <FooterPage/>
                </Footer>
            </Layout>
        </>
    )
}
