interface TreeNode {
    id: number;
    name: string;
    children?: TreeNode[];
}

class HashTree {
    private hashTable: Record<number, TreeNode> = {};

    constructor(tree: TreeNode[]) {
        this.buildHashTree(tree);
    }

    private buildHashTree(tree: TreeNode[]) {
        // 构建哈希树
        function traverse(node: TreeNode, hashTable: Record<number, TreeNode>) {
            hashTable[node.id] = node;
            if (node.children) {
                for (const child of node.children) {
                    traverse(child, hashTable);
                }
            }
        }
        for (const node of tree) {
            traverse(node, this.hashTable);
        }
    }

    public findNodeById(id: number): TreeNode | undefined {
        // 根据 id 查找节点
        return this.hashTable[id];
    }

    public addChild(node: TreeNode, parentId?: number): boolean {
        // 添加节点，并指定父节点
        if (!node || !node.id || !node.name) {
            throw new Error('Invalid node object');
        }

        if (parentId !== undefined && (!this.hashTable[parentId] || !this.hashTable[parentId].children)) {
            return false;
        }

        if (parentId !== undefined) {
            const parentNode = this.hashTable[parentId];
            if (!parentNode.children) {
                parentNode.children = [];
            }
            parentNode.children.push(node);
        } else {
            if (this.hashTable[node.id]) {
                return false;
            }
            this.hashTable[node.id] = node;
        }
        return true;
    }

    public removeNodeById(id: number): boolean {
        // 根据 id 删除节点
        const node = this.hashTable[id];
        if (!node) {
            return false;
        }

        // 从父节点的 children 中删除该节点
        const parent = this.getParentNode(id);
        if (parent) {
            parent.children = parent.children?.filter((child) => child.id !== id);
        }

        // 删除该节点及其子节点
        this.traverseSubtree(node, (n) => {
            delete this.hashTable[n.id];
        });

        return true;
    }

    private getParentNode(id: number): TreeNode | undefined {
        // 获取父节点
        for (const node of Object.values(this.hashTable)) {
            if (node.children && node.children.some((child) => child.id === id)) {
                return node;
            }
        }
        return undefined;
    }

    private traverseSubtree(node: TreeNode, callback: (node: TreeNode) => void) {
        // 遍历子树
        callback(node);
        if (node.children) {
            for (const child of node.children) {
                this.traverseSubtree(child, callback);
            }
        }
    }
}

export default HashTree;