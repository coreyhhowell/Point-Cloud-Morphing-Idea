class PlantLifecycleVisualization {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.pointClouds = [];
        this.currentStage = 0;
        this.isAnimating = false;
        this.autoPlay = false;
        this.animationSpeed = 2;
        
        this.stageInfo = [
            { name: "Stage 1: Seed", desc: "The beginning of life, compact and full of potential" },
            { name: "Stage 2: Sprout", desc: "First signs of growth, breaking through the soil" },
            { name: "Stage 3: Growth", desc: "Rapid expansion, leaves unfurling towards the light" },
            { name: "Stage 4: Mature", desc: "Full bloom, complex structure at peak development" }
        ];
        
        this.init();
        this.createPointClouds();
        this.setupControls();
        this.animate();
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        this.camera.position.set(0, 0, 5);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        // Add point light for dramatic effect
        const pointLight = new THREE.PointLight(0x4CAF50, 1, 100);
        pointLight.position.set(0, 5, 5);
        this.scene.add(pointLight);
    }
    
    createPointClouds() {
        const pointCount = 2000;
        
        // Create four different point cloud geometries for plant lifecycle
        const geometries = [
            this.createSeedGeometry(pointCount),
            this.createSproutGeometry(pointCount),
            this.createGrowthGeometry(pointCount),
            this.createMatureGeometry(pointCount)
        ];
        
        // Create materials for each stage with different colors
        const materials = [
            new THREE.PointsMaterial({ 
                color: 0x8B4513, 
                size: 0.02,
                transparent: true,
                opacity: 0.8,
                vertexColors: true
            }),
            new THREE.PointsMaterial({ 
                color: 0x90EE90, 
                size: 0.015,
                transparent: true,
                opacity: 0.8,
                vertexColors: true
            }),
            new THREE.PointsMaterial({ 
                color: 0x32CD32, 
                size: 0.012,
                transparent: true,
                opacity: 0.8,
                vertexColors: true
            }),
            new THREE.PointsMaterial({ 
                color: 0x228B22, 
                size: 0.01,
                transparent: true,
                opacity: 0.8,
                vertexColors: true
            })
        ];
        
        // Create point clouds
        for (let i = 0; i < 4; i++) {
            const pointCloud = new THREE.Points(geometries[i], materials[i]);
            pointCloud.visible = i === 0;
            this.scene.add(pointCloud);
            this.pointClouds.push(pointCloud);
        }
        
        // Store original positions for morphing
        this.originalPositions = geometries.map(geo => geo.attributes.position.array.slice());
        this.currentPositions = new Float32Array(this.originalPositions[0]);
        this.targetPositions = new Float32Array(this.originalPositions[0]);
    }
    
    createSeedGeometry(count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        // Compact seed shape - small sphere
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const radius = Math.random() * 0.3;
            
            positions[i3] = radius * Math.sin(theta) * Math.cos(phi);
            positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            positions[i3 + 2] = radius * Math.cos(theta);
            
            // Brown colors for seed
            colors[i3] = 0.5 + Math.random() * 0.3;
            colors[i3 + 1] = 0.3 + Math.random() * 0.2;
            colors[i3 + 2] = 0.1 + Math.random() * 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geometry;
    }
    
    createSproutGeometry(count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        // Small sprout with tiny leaves
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const t = i / count;
            
            if (t < 0.6) {
                // Stem
                positions[i3] = (Math.random() - 0.5) * 0.1;
                positions[i3 + 1] = Math.random() * 0.8 - 0.2;
                positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
            } else {
                // Small leaves
                const angle = Math.random() * Math.PI * 2;
                const leafRadius = Math.random() * 0.3;
                positions[i3] = leafRadius * Math.cos(angle);
                positions[i3 + 1] = 0.3 + Math.random() * 0.2;
                positions[i3 + 2] = leafRadius * Math.sin(angle);
            }
            
            // Light green colors
            colors[i3] = 0.3 + Math.random() * 0.3;
            colors[i3 + 1] = 0.7 + Math.random() * 0.3;
            colors[i3 + 2] = 0.3 + Math.random() * 0.3;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geometry;
    }
    
    createGrowthGeometry(count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        // Growing plant with expanding leaves
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const t = i / count;
            
            if (t < 0.3) {
                // Main stem
                positions[i3] = (Math.random() - 0.5) * 0.15;
                positions[i3 + 1] = Math.random() * 1.2 - 0.3;
                positions[i3 + 2] = (Math.random() - 0.5) * 0.15;
            } else {
                // Expanding leaves and branches
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 0.8;
                const height = Math.random() * 0.6 + 0.2;
                
                positions[i3] = radius * Math.cos(angle);
                positions[i3 + 1] = height;
                positions[i3 + 2] = radius * Math.sin(angle);
            }
            
            // Medium green colors
            colors[i3] = 0.2 + Math.random() * 0.3;
            colors[i3 + 1] = 0.6 + Math.random() * 0.4;
            colors[i3 + 2] = 0.2 + Math.random() * 0.3;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geometry;
    }
    
    createMatureGeometry(count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        // Mature plant with complex structure
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const t = i / count;
            
            if (t < 0.2) {
                // Thick trunk
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 0.2;
                positions[i3] = radius * Math.cos(angle);
                positions[i3 + 1] = Math.random() * 0.8 - 0.4;
                positions[i3 + 2] = radius * Math.sin(angle);
            } else {
                // Complex branching structure
                const branchAngle = Math.random() * Math.PI * 2;
                const branchRadius = Math.random() * 1.2;
                const branchHeight = Math.random() * 1.0 + 0.2;
                
                // Add some fractal-like branching
                const subBranch = Math.random() * 0.3;
                positions[i3] = (branchRadius + subBranch) * Math.cos(branchAngle);
                positions[i3 + 1] = branchHeight;
                positions[i3 + 2] = (branchRadius + subBranch) * Math.sin(branchAngle);
            }
            
            // Dark green colors with some variation
            colors[i3] = 0.1 + Math.random() * 0.4;
            colors[i3 + 1] = 0.5 + Math.random() * 0.5;
            colors[i3 + 2] = 0.1 + Math.random() * 0.4;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geometry;
    }
    
    morphToStage(targetStage, t) {
        const sourceStage = Math.floor(targetStage);
        const nextStage = Math.min(sourceStage + 1, 3);
        const morphT = targetStage - sourceStage;
        
        const sourcePositions = this.originalPositions[sourceStage];
        const targetPositions = this.originalPositions[nextStage];
        
        for (let i = 0; i < sourcePositions.length; i++) {
            this.currentPositions[i] = sourcePositions[i] + (targetPositions[i] - sourcePositions[i]) * morphT;
        }
        
        // Update the visible point cloud
        this.pointClouds.forEach(cloud => cloud.visible = false);
        const activeCloud = this.pointClouds[sourceStage];
        activeCloud.visible = true;
        activeCloud.geometry.attributes.position.array = this.currentPositions;
        activeCloud.geometry.attributes.position.needsUpdate = true;
        
        // Update opacity for smooth transition
        if (morphT > 0 && nextStage < this.pointClouds.length) {
            const nextCloud = this.pointClouds[nextStage];
            nextCloud.visible = true;
            nextCloud.material.opacity = morphT;
            activeCloud.material.opacity = 1 - morphT;
        }
    }
    
    setupControls() {
        const stageSlider = document.getElementById('stageSlider');
        const speedSlider = document.getElementById('speedSlider');
        const autoPlayBtn = document.getElementById('autoPlay');
        const resetBtn = document.getElementById('resetBtn');
        const stageButtons = document.querySelectorAll('.stage-btn');
        
        stageSlider.addEventListener('input', (e) => {
            this.currentStage = parseFloat(e.target.value);
            this.morphToStage(this.currentStage);
            this.updateStageInfo();
            this.updateActiveButton();
        });
        
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
        });
        
        autoPlayBtn.addEventListener('click', () => {
            this.autoPlay = !this.autoPlay;
            autoPlayBtn.textContent = this.autoPlay ? 'Stop Auto' : 'Auto Play';
            autoPlayBtn.classList.toggle('active', this.autoPlay);
        });
        
        resetBtn.addEventListener('click', () => {
            this.currentStage = 0;
            stageSlider.value = 0;
            this.morphToStage(0);
            this.updateStageInfo();
            this.updateActiveButton();
        });
        
        stageButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.currentStage = index;
                stageSlider.value = index;
                this.morphToStage(index);
                this.updateStageInfo();
                this.updateActiveButton();
            });
        });
    }
    
    updateStageInfo() {
        const stageIndex = Math.floor(this.currentStage);
        const info = this.stageInfo[stageIndex];
        document.getElementById('stageInfo').textContent = info.name;
        document.getElementById('stageDesc').textContent = info.desc;
    }
    
    updateActiveButton() {
        const buttons = document.querySelectorAll('.stage-btn');
        buttons.forEach((btn, index) => {
            btn.classList.toggle('active', Math.floor(this.currentStage) === index);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.autoPlay) {
            this.currentStage += 0.01 * this.animationSpeed;
            if (this.currentStage > 3) {
                this.currentStage = 0;
            }
            document.getElementById('stageSlider').value = this.currentStage;
            this.morphToStage(this.currentStage);
            this.updateStageInfo();
            this.updateActiveButton();
        }
        
        // Rotate the scene slowly
        this.pointClouds.forEach(cloud => {
            if (cloud.visible) {
                cloud.rotation.y += 0.005;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.plantViz) {
        window.plantViz.camera.aspect = window.innerWidth / window.innerHeight;
        window.plantViz.camera.updateProjectionMatrix();
        window.plantViz.renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Initialize the visualization when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.plantViz = new PlantLifecycleVisualization();
});
