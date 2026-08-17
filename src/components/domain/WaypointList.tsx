import React from 'react';
import { View, Pressable } from 'react-native';
import { Card } from '../core/Card';
import { Typography } from '../core/Typography';
import { Badge } from '../core/Badge';
import { Button } from '../core/Button';
import { type Waypoint } from '../../types/robot';
import { Trash2, Navigation, MapPin, CheckCircle2, Clock } from 'lucide-react-native';

interface WaypointListProps {
  waypoints: Waypoint[];
  activeWaypointId?: string | null;
  onSelectWaypoint?: (waypoint: Waypoint) => void;
  onDeleteWaypoint?: (id: string) => void;
  onDispatchWaypoint?: (waypoint: Waypoint) => void;
  className?: string;
}

export function WaypointList({
  waypoints,
  activeWaypointId,
  onSelectWaypoint,
  onDeleteWaypoint,
  onDispatchWaypoint,
  className = '',
}: WaypointListProps) {
  if (!waypoints || waypoints.length === 0) {
    return (
      <Card className={`items-center justify-center p-8 border-dashed border-surfaceBorder ${className}`}>
        <View className="p-4 rounded-full bg-surfaceElevated border border-surfaceBorder mb-3">
          <MapPin size={28} color="#64748B" />
        </View>
        <Typography variant="h3" color="ink" className="text-center mb-1">
          No Waypoints Configured
        </Typography>
        <Typography variant="body" color="inkMuted" className="text-center text-sm max-w-[260px]">
          Tap anywhere on the GPS map above to place up to 6 treatment waypoints.
        </Typography>
      </Card>
    );
  }

  return (
    <View className={`space-y-3 gap-3 ${className}`}>
      {waypoints.map((waypoint, index) => {
        const isTarget = activeWaypointId === waypoint.id;
        const pointNumber = waypoint.point_number || index + 1;
        const label = waypoint.label || `Point ${pointNumber}`;

        return (
          <Card
            key={waypoint.id || `wp-${index}`}
            variant={isTarget ? 'highlight' : 'default'}
            onPress={onSelectWaypoint ? () => onSelectWaypoint(waypoint) : undefined}
            className={`p-4 ${isTarget ? 'border-brand' : 'border-surfaceBorder'}`}
          >
            <View className="flex-row items-center justify-between">
              {/* Left: Point Index Badge & Info */}
              <View className="flex-row items-center flex-1 mr-3">
                {/* Point Number Chip */}
                <View
                  className={`w-11 h-11 rounded-2xl items-center justify-center border mr-3.5 ${
                    isTarget
                      ? 'bg-brand text-inkDark border-brand shadow-sm shadow-brand/20'
                      : waypoint.treated
                      ? 'bg-leafMuted border-leaf/40'
                      : 'bg-surfaceElevated border-surfaceBorder'
                  }`}
                >
                  <Typography
                    variant="h3"
                    color={isTarget ? 'dark' : waypoint.treated ? 'leaf' : 'brand'}
                    className="font-bold text-center"
                  >
                    P{pointNumber}
                  </Typography>
                </View>

                {/* Coordinate Readouts & Metadata */}
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2">
                    <Typography variant="h3" color="ink" className="font-semibold mr-2">
                      {label}
                    </Typography>
                    {isTarget && (
                      <Badge label="ACTIVE" status="brand" size="sm" showDot />
                    )}
                  </View>

                  <Typography variant="caption" color="inkMuted" className="mt-0.5 font-mono">
                    {waypoint.latitude.toFixed(6)}° N, {waypoint.longitude.toFixed(6)}° E
                  </Typography>

                  <View className="flex-row items-center mt-1.5 gap-2">
                    <View className="bg-surfaceElevated px-2 py-0.5 rounded-md border border-surfaceBorder">
                      <Typography variant="caption" color="inkSubtle" className="text-[10px] font-medium">
                        {waypoint.radius_meters || 2.0}m Boundary Zone
                      </Typography>
                    </View>

                    {waypoint.treated ? (
                      <View className="flex-row items-center">
                        <CheckCircle2 size={12} color="#10B981" />
                        <Typography variant="caption" color="leaf" className="ml-1 text-[11px] font-medium">
                          Treated
                        </Typography>
                      </View>
                    ) : (
                      <View className="flex-row items-center">
                        <Clock size={12} color="#F59E0B" />
                        <Typography variant="caption" color="amber" className="ml-1 text-[11px] font-medium">
                          Pending
                        </Typography>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Right: Actions */}
              <View className="flex-row items-center space-x-2">
                {onDispatchWaypoint && !isTarget && (
                  <Button
                    size="small"
                    variant="outline"
                    icon={Navigation}
                    label="Dispatch"
                    onPress={() => onDispatchWaypoint(waypoint)}
                    className="mr-2"
                  />
                )}

                {onDeleteWaypoint && (
                  <Button
                    size="small"
                    variant="danger"
                    icon={Trash2}
                    onPress={() => onDeleteWaypoint(waypoint.id)}
                    accessibilityLabel={`Delete ${label}`}
                  />
                )}
              </View>
            </View>
          </Card>
        );
      })}
    </View>
  );
}
