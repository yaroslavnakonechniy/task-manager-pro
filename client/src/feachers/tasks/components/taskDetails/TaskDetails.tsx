import { Outlet, useParams } from "react-router-dom"
import { Descriptions, Divider, Space, Button, Spin, Alert, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useGetTaskByIdQuery } from "../../api/tasks.api";
import { useDeleteTask } from "../../../../hooks/UseDeleteTask";

const { Item } = Descriptions;

export const TaskDetails = () => {
    const { taskId } = useParams<{taskId: string}>();
    const { data, isLoading, isError } = useGetTaskByIdQuery(taskId!);
    const { performDelete } = useDeleteTask();

    if (isLoading) {
        return <Spin size="large" style={{ marginTop: 100 }} />;
    }

    if (isError) {
        return <Alert type="error" title="Failed to load boards" />;
    }

    const handleDelete = () => {
        if (taskId && data?.boardId) {
            performDelete({ id: taskId, boardId: data.boardId });
        }
    };

    return(
        <>
            <Divider />
                <Outlet/>
                <Descriptions title="Task Info" style={{ padding: "40px" }}>
                    <Item label="TaskTitle">{data?.title}</Item>
                    <Item label="TaskWorkflow">{(data?.workflow as any).label}</Item>
                    <Item label="TaskDescription">{data?.description}</Item>
                </Descriptions>
                    <Space style={{ marginTop: 16 }}>

                    <Button type="primary" icon={<EditOutlined />} size="small">
                        <Link to={`/tasks/${taskId}/edit`}>Edit Task</Link>
                    </Button>

                    <Button type="primary" icon={<EditOutlined />} size="small">
                        <Link to={`/tasks/${taskId}/comments/create`}>Add Comment</Link>
                    </Button>

                    <Popconfirm
                        title="Delete Task?"
                        description="Are you sure you want to delete this Task?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small">
                            Delete Task
                        </Button>
                    </Popconfirm>

                    <Button icon={<ArrowLeftOutlined />} size="small">
                        <Link to={`/boards/${data?.boardId}/tasks/`}>Back</Link>
                    </Button>
                </Space>
            <Divider />
        </>
    )
}
