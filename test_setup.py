#!/usr/bin/env python3
"""
Quick test script to verify the setup
"""

import sys
import os

def test_imports():
    """Test if all required packages are installed"""
    print("🔍 Testing package imports...")
    
    required_packages = [
        ('flask', 'Flask'),
        ('flask_cors', 'Flask-CORS'),
        ('requests', 'Requests'),
        ('moviepy.editor', 'MoviePy'),
        ('numpy', 'NumPy'),
        ('PIL', 'Pillow'),
    ]
    
    failed = []
    for package, name in required_packages:
        try:
            __import__(package)
            print(f"  ✅ {name}")
        except ImportError:
            print(f"  ❌ {name}")
            failed.append(name)
    
    if failed:
        print(f"\n⚠️  Missing packages: {', '.join(failed)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    print("✅ All packages installed!\n")
    return True

def test_directories():
    """Test if required directories exist"""
    print("📁 Testing directory structure...")
    
    required_dirs = [
        'static',
        'static/css',
        'static/js',
        'templates',
    ]
    
    failed = []
    for dir_path in required_dirs:
        if os.path.exists(dir_path):
            print(f"  ✅ {dir_path}/")
        else:
            print(f"  ❌ {dir_path}/")
            failed.append(dir_path)
    
    if failed:
        print(f"\n⚠️  Missing directories: {', '.join(failed)}")
        return False
    
    print("✅ All directories exist!\n")
    return True

def test_files():
    """Test if required files exist"""
    print("📄 Testing required files...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'templates/index.html',
        'static/css/style.css',
        'static/js/app.js',
    ]
    
    failed = []
    for file_path in required_files:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"  ✅ {file_path} ({size} bytes)")
        else:
            print(f"  ❌ {file_path}")
            failed.append(file_path)
    
    if failed:
        print(f"\n⚠️  Missing files: {', '.join(failed)}")
        return False
    
    print("✅ All files exist!\n")
    return True

def test_environment():
    """Test environment configuration"""
    print("🔧 Testing environment...")
    
    if os.path.exists('.env'):
        print("  ✅ .env file exists")
        with open('.env', 'r') as f:
            content = f.read()
            if 'REPLICATE_API_TOKEN' in content:
                if 'your_replicate_token_here' not in content:
                    print("  ✅ API token configured")
                else:
                    print("  ⚠️  API token not set (using fallback mode)")
            else:
                print("  ⚠️  No API token in .env")
    else:
        print("  ⚠️  No .env file (optional)")
        print("  ℹ️  Run: cp .env.example .env")
    
    print()
    return True

def test_app():
    """Test if app.py can be imported"""
    print("🐍 Testing Flask application...")
    
    try:
        import app as flask_app
        print("  ✅ app.py imports successfully")
        print("  ✅ Flask app created")
        print()
        return True
    except Exception as e:
        print(f"  ❌ Error: {e}")
        print()
        return False

def main():
    print("=" * 60)
    print("🎬 AI Animated Video Generator - Setup Test")
    print("=" * 60)
    print()
    
    tests = [
        test_directories,
        test_files,
        test_imports,
        test_environment,
        test_app,
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print("=" * 60)
    if all(results):
        print("✅ ALL TESTS PASSED!")
        print()
        print("🚀 Ready to run!")
        print("   Run: python app.py")
        print("   Then open: http://localhost:5000")
    else:
        print("⚠️  SOME TESTS FAILED")
        print()
        print("Please fix the issues above before running the app.")
        sys.exit(1)
    print("=" * 60)

if __name__ == '__main__':
    main()
