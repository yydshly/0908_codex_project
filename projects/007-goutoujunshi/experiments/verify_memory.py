"""Exercise upstream memory commands with fictional data in a temporary directory."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

PROJECT = Path(__file__).resolve().parents[1]
SCRIPT = PROJECT / 'upstream/scripts/memory_store.py'

def main():
    checks = []
    with tempfile.TemporaryDirectory(prefix='goutoujunshi-demo-') as scratch:
        env = dict(os.environ, GOUTOUJUNSHI_MEMORY_DIR=scratch, PYTHONIOENCODING='utf-8')
        def run(label, args, predicate):
            proc = subprocess.run([sys.executable, str(SCRIPT), *args], env=env, capture_output=True, encoding='utf-8')
            result = json.loads(proc.stdout)
            assert predicate(result), (label, result)
            checks.append({'name': label, 'passed': True, 'result': result})
            return result
        run('未启用时不创建档案', ['status'], lambda r: not r['consent_enabled'])
        run('启用需要明确确认', ['enable'], lambda r: r.get('error', {}).get('code') == 'CONFIRMATION_REQUIRED')
        run('确认启用测试档案', ['enable', '--confirm'], lambda r: r['consent_enabled'])
        fact = dict(scope='object', subject_id='demo-a', field='preference', value='虚构对象A喜欢散步', source_type='user_report', confidence='medium', source_ref='虚构演示输入')
        run('保存有来源的事实', ['apply', '--json', json.dumps(fact, ensure_ascii=False)], lambda r: r.get('ok') is True)
        run('按对象召回精简档案', ['context', '--subject-id', 'demo-a'], lambda r: r['count'] == 1 and r['memories'][0]['value'] == fact['value'])
        invalid = dict(fact, source_type='assistant_inference', value='对象A一定喜欢用户')
        run('拒绝将模型推断写成对象事实', ['apply', '--json', json.dumps(invalid, ensure_ascii=False)], lambda r: r.get('error', {}).get('code') == 'SOURCE_NOT_ELIGIBLE')
        run('暂停记忆', ['pause'], lambda r: r.get('ok') is True)
        run('暂停后阻止写入', ['apply', '--json', json.dumps(fact, ensure_ascii=False)], lambda r: r.get('error', {}).get('code') == 'MEMORY_PAUSED')
        run('恢复记忆', ['resume'], lambda r: r.get('ok') is True)
        run('撤销最近一次写入', ['undo'], lambda r: r.get('ok') is True)
        run('撤销后档案为空', ['context', '--subject-id', 'demo-a'], lambda r: r['count'] == 0)
        run('清除测试数据库', ['clear', '--confirm'], lambda r: r.get('deleted') is True)
        assert not (Path(scratch) / 'memory.sqlite3').exists()
    report = {'commit': '4ced1d57561563f4b556f555ee1c8c91ffb16355', 'scope': '真实运行上游记忆脚本；全部输入为虚构数据；不启用个人记忆', 'checks': checks}
    destination = PROJECT / 'notes/memory-verification.json'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{len(checks)} memory checks passed')

if __name__ == '__main__':
    main()
