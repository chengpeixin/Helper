import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/zhi-yuan-helper.js',
            format: 'umd',
            name: 'zhi-yuan-helper',
            sourcemap: true
        },
        {
            file: 'dist/zhi-yuan-helper.esm.js',
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        del({targets: 'dist/*'}),
        typescript(),
        commonjs(),
        resolve(),
        terser()
    ]
};
