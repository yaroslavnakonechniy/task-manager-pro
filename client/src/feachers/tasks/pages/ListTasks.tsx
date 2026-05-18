import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Row, Col, Spin, Alert } from "antd";
import { Column } from "../components/column/Column";
import { useGetTasksBoardByIdQuery } from "../../boards/api/boards.api";

export const ListTasks = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const navigate = useNavigate();

    const { data = [], isLoading, error } = useGetTasksBoardByIdQuery(boardId!);

    useEffect(() => {
        console.log("📦 [LIST TASKS] data:", data);
    }, [data]);
    // scroll top only once
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // redirect only if loaded and truly empty
    useEffect(() => {
        if (!isLoading && data.length === 0) {
            const timer = setTimeout(() => {
                navigate(`/boards/${boardId}/tasks/create`);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isLoading, data.length, navigate, boardId]);

    const todo = data.filter(t => t.workflow === "todo");
    const progress = data.filter(t => t.workflow === "progress");
    const done = data.filter(t => t.workflow === "done");

    console.log('todo', todo);
    console.log('progress', progress);
    console.log('done', done);

    if (isLoading) {
        return <Spin size="large" style={{ marginTop: 100 }} />;
    }

    if (error) {
        return (
            <Alert
                type="error"
                message="Failed to load tasks"
                description="Something went wrong while loading tasks."
                style={{ marginTop: 20 }}
            />
        );
    }

    return (
        <>
            <hr />

            <div style={{ padding: 40 }}>
                <Row gutter={16} align="top">
                    <Col span={8}>
                        <Column title="Todo" color="#f0f0f0" tasks={todo} />
                    </Col>

                    <Col span={8}>
                        <Column title="In Progress" color="#e6f4ff" tasks={progress} />
                    </Col>

                    <Col span={8}>
                        <Column title="Done" color="#f6ffed" tasks={done} />
                    </Col>
                </Row>
            </div>

            <hr />
        </>
    );
};
