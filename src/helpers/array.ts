type TreeNode = {
    id: number;
    name: string;
    [key: string]: any; // 允许任意额外的属性
};

type TreeNodeMap = {
    [id: number]: TreeNode;
};

/**
 * 将一个扁平的节点列表转化为树形结构
 * @param nodes 节点列表
 * @param options 配置项，可指定节点 ID 和父节点 ID 的键名，默认为 'id' 和 'parentId'
 * @returns 树形结构的根节点列表
 */
export function buildTree(
    nodes: TreeNode[],
    options: { idKey?: string; parentIdKey?: string } = {}
): TreeNode[] {
    const idKey = options.idKey ?? 'id';
    const parentIdKey = options.parentIdKey ?? 'parentId';

    const nodeMap: TreeNodeMap = {};
    for (const node of nodes) {
        const id = node[idKey];
        nodeMap[id] = node;
        node.children = [];
    }

    const roots: TreeNode[] = [];
    for (const node of nodes) {
        const parentId = node[parentIdKey];
        if (parentId === undefined) {
            roots.push(node);
        } else {
            const parent = nodeMap[parentId];
            if (parent) {
                parent.children.push(node);
            }
        }
    }

    return roots;
}
