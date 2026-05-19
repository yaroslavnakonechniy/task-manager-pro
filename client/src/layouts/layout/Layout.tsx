import { Outlet } from "react-router-dom"
import { Layout } from 'antd';
import { AppHeader } from "../header/AppHeader";
import { FooterPage } from "../footer/Footer";
import styles from "./styles.module.scss";

const { Footer, Content, Header } = Layout;
 
export const LayoutPage = () => {
    return (
        <Layout className={styles.layout}>
        
            <Header>
                <AppHeader />
            </Header>

            <Content className={styles.content}>
                <Outlet />
            </Content>

            <Footer className={styles.footer}>
                <FooterPage />
            </Footer>

        </Layout>
    );
};
