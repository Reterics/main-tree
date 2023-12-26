import {createRoot} from "react-dom/client";

function MainTreeApp() {
    return <span>Hello from MainTree!</span>;
}

window.addEventListener(
    'load',
    function () {
        const mainTreeNode = document.getElementById('main-tree');
        if (mainTreeNode) {
            const root = createRoot( mainTreeNode );

            root.render(
                <MainTreeApp />,
            );
        } else {
            throw Error('MainTree DOM is not found');
        }
    },
    false
);