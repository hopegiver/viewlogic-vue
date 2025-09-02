const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function generateCallGraph(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['classProperties', 'asyncGenerators']
    });

    const callGraph = {
        functions: new Map(),
        calls: []
    };

    let currentFunction = null;

    traverse(ast, {
        // 메서드 정의 찾기
        ClassMethod(path) {
            const functionName = path.node.key.name;
            currentFunction = functionName;
            
            if (!callGraph.functions.has(functionName)) {
                callGraph.functions.set(functionName, {
                    name: functionName,
                    type: 'method',
                    line: path.node.loc?.start.line || 0,
                    calls: [],
                    calledBy: []
                });
            }
        },

        // 함수 정의 찾기
        FunctionDeclaration(path) {
            const functionName = path.node.id.name;
            currentFunction = functionName;
            
            if (!callGraph.functions.has(functionName)) {
                callGraph.functions.set(functionName, {
                    name: functionName,
                    type: 'function',
                    line: path.node.loc?.start.line || 0,
                    calls: [],
                    calledBy: []
                });
            }
        },

        // 함수 호출 찾기
        CallExpression(path) {
            if (!currentFunction) return;

            let calledFunction = null;

            // this.functionName() 패턴
            if (path.node.callee.type === 'MemberExpression' && 
                path.node.callee.object.type === 'ThisExpression') {
                calledFunction = path.node.callee.property.name;
            }
            // functionName() 패턴
            else if (path.node.callee.type === 'Identifier') {
                calledFunction = path.node.callee.name;
            }

            if (calledFunction && callGraph.functions.has(calledFunction)) {
                // 호출 관계 기록
                const caller = callGraph.functions.get(currentFunction);
                const callee = callGraph.functions.get(calledFunction);

                if (!caller.calls.includes(calledFunction)) {
                    caller.calls.push(calledFunction);
                }
                if (!callee.calledBy.includes(currentFunction)) {
                    callee.calledBy.push(currentFunction);
                }

                callGraph.calls.push({
                    from: currentFunction,
                    to: calledFunction,
                    line: path.node.loc?.start.line || 0
                });
            }
        }
    });

    // Map을 일반 객체로 변환
    const result = {
        functions: Object.fromEntries(callGraph.functions),
        calls: callGraph.calls,
        metadata: {
            totalFunctions: callGraph.functions.size,
            totalCalls: callGraph.calls.length,
            generatedAt: new Date().toISOString(),
            sourceFile: filePath
        }
    };

    return result;
}

// router.js 콜그래프 생성
try {
    const routerCallGraph = generateCallGraph('./js/router.js');
    fs.writeFileSync('./.artifacts/callgraph/router-function-callgraph.json', 
        JSON.stringify(routerCallGraph, null, 2));
    console.log('✅ router.js 함수 콜그래프 생성 완료');
} catch (error) {
    console.error('❌ router.js 콜그래프 생성 실패:', error.message);
}

// build.cjs 콜그래프 생성  
try {
    const buildCallGraph = generateCallGraph('./build.cjs');
    fs.writeFileSync('./.artifacts/callgraph/build-function-callgraph.json', 
        JSON.stringify(buildCallGraph, null, 2));
    console.log('✅ build.cjs 함수 콜그래프 생성 완료');
} catch (error) {
    console.error('❌ build.cjs 콜그래프 생성 실패:', error.message);
}