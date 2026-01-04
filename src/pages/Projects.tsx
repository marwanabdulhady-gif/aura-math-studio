import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { FolderOpen, Plus, Clock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/projectStore';
import { Link } from 'react-router-dom';

const Projects = () => {
  const { projects } = useProjectStore();

  return (
    <>
      <Helmet>
        <title>Projects - Aura Math AI</title>
        <meta name="description" content="Manage your math education video projects" />
      </Helmet>
      
      <MainLayout>
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="gradient-text">Projects</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage your math education videos
                </p>
              </div>
              <Link to="/">
                <Button className="gap-2 bg-gradient-primary hover:opacity-90 glow-primary">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-8">
          {projects.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FolderOpen className="w-20 h-20 mx-auto mb-6 text-muted-foreground/30" />
              <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
              <p className="text-muted-foreground mb-6">Create your first math education video</p>
              <Link to="/">
                <Button className="gap-2 bg-gradient-primary hover:opacity-90 glow-primary">
                  <Plus className="w-4 h-4" />
                  Create Project
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.projectId}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="aspect-video bg-gradient-surface flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{project.topic || 'Untitled'}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{project.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'COMPLETED' ? 'bg-success/20 text-success' :
                        project.status === 'FAILED' ? 'bg-destructive/20 text-destructive' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default Projects;
